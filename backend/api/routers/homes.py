from pydantic import BaseModel
from typing import Optional, List
from fastapi import APIRouter, status, HTTPException
from models import Home, UserHome, UserHomeRole, UserHomeStatus, User
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/homes",
    tags=["homes"]
)

class HomeBase(BaseModel):
    name: str

class HomeCreate(HomeBase):
    adafruitiokey: str
    adafruitiouser: str

class InviteMemberRequest(BaseModel):
    home_id: int
    email: str
    role: str

class InvitationRespondRequest(BaseModel):
    user_home_id: int
    action: str # 'accept' or 'reject'

@router.get('/')
def get_home(db: db_dependency, user: user_dependency, home_id: int):
    # Verify access
    user_id = user.get('id')
    x = db.query(UserHome).filter(
        UserHome.user_id == user_id,
        UserHome.home_id == home_id,
        UserHome.status == UserHomeStatus.accepted
    ).first()
    if not x:
        raise HTTPException(status_code=403, detail="You do not have access to this home.")
    return db.query(Home).filter(Home.id == home_id).first()

@router.get('/homes')
def get_homes(db: db_dependency, user: user_dependency):
    user_id = user.get('id')
    user_homes = db.query(UserHome).filter(
        UserHome.user_id == user_id,
        UserHome.status == UserHomeStatus.accepted
    ).all()
    return [x.home for x in user_homes]

@router.post('/', status_code=status.HTTP_201_CREATED)
def create_home(db: db_dependency, user: user_dependency, home: HomeCreate):
    db_home = Home(
        name=home.name,
        adafruitiokey=home.adafruitiokey.strip(),
        adafruitiouser=home.adafruitiouser.strip(),
        owner_id=user.get('id')
    )
    db.add(db_home)
    db.commit()
    db.refresh(db_home)
    
    # Creator becomes Owner
    db_x = UserHome(
        user_id=user.get('id'),
        home_id=db_home.id,
        role=UserHomeRole.owner,
        status=UserHomeStatus.accepted
    )
    db.add(db_x)
    db.commit()
    return db_home

@router.delete('/')
def delete_home(db: db_dependency, user: user_dependency, home_id: int):
    # Only Owner can delete the entire home!
    user_id = user.get('id')
    x = db.query(UserHome).filter(
        UserHome.user_id == user_id,
        UserHome.home_id == home_id,
        UserHome.status == UserHomeStatus.accepted
    ).first()
    
    if not x or x.role != UserHomeRole.owner:
        raise HTTPException(status_code=403, detail="Only the Owner can delete this home.")
        
    db_home = db.query(Home).filter(Home.id == home_id).first()
    if db_home:
        db.delete(db_home)
        db.commit()
    return db_home

@router.put('/')
def update_home(db: db_dependency, user: user_dependency, home_id: int, home: HomeCreate):
    # Only Owner or Admin can update home settings!
    user_id = user.get('id')
    x = db.query(UserHome).filter(
        UserHome.user_id == user_id,
        UserHome.home_id == home_id,
        UserHome.status == UserHomeStatus.accepted
    ).first()
    
    if not x or x.role not in [UserHomeRole.owner, UserHomeRole.manager]:
        raise HTTPException(status_code=403, detail="Only Owner or Manager can update home settings.")
        
    db_home = db.query(Home).filter(Home.id == home_id).first()
    if not db_home:
        raise HTTPException(status_code=404, detail="Home not found.")
    
    db_home.name = home.name
    db_home.adafruitiokey = home.adafruitiokey.strip()
    db_home.adafruitiouser = home.adafruitiouser.strip()
    
    db.commit()
    db.refresh(db_home)
    return db_home

# --- Invitations and Membership API ---

@router.post('/invite')
def invite_member(db: db_dependency, user: user_dependency, req: InviteMemberRequest):
    # 1. Verify current user's role in this home is Owner or Manager
    current_x = db.query(UserHome).filter(
        UserHome.user_id == user.get('id'),
        UserHome.home_id == req.home_id,
        UserHome.status == UserHomeStatus.accepted
    ).first()
    
    if not current_x:
        raise HTTPException(status_code=403, detail="You do not have access to this home.")
    
    if current_x.role not in [UserHomeRole.owner, UserHomeRole.manager]:
        raise HTTPException(status_code=403, detail="Only Owner or Manager can invite members.")
        
    # 2. Check if the target user exists by email
    target_user = db.query(User).filter(User.email == req.email.strip()).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User with this email does not exist.")
        
    # 3. Check if they already have a relationship
    existing = db.query(UserHome).filter(
        UserHome.user_id == target_user.id,
        UserHome.home_id == req.home_id
    ).first()
    
    try:
        target_role = UserHomeRole(req.role)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid role: {req.role}. Choose from: Owner, Admin, Member.")
    
    if existing:
        if existing.status == UserHomeStatus.accepted:
            raise HTTPException(status_code=400, detail="User is already a member of this home.")
        elif existing.status == UserHomeStatus.pending:
            raise HTTPException(status_code=400, detail="An invitation is already pending for this user.")
        else:
            # Re-invite
            existing.status = UserHomeStatus.pending
            existing.role = target_role
            db.commit()
            db.refresh(existing)
            target_x = existing
    else:
        target_x = UserHome(
            user_id=target_user.id,
            home_id=req.home_id,
            role=target_role,
            status=UserHomeStatus.pending
        )
        db.add(target_x)
        db.commit()
        
    # 4. Mock sending an email
    home_obj = db.query(Home).filter(Home.id == req.home_id).first()
    print(f"[Email Service] Sending invitation email to {target_user.email} to join home '{home_obj.name}' as '{req.role}'")
    
    return {"status": "success", "message": "Invitation sent successfully."}

@router.get('/invitations')
def get_invitations(db: db_dependency, user: user_dependency):
    user_id = user.get('id')
    invites = db.query(UserHome).filter(
        UserHome.user_id == user_id,
        UserHome.status == UserHomeStatus.pending
    ).all()
    
    res = []
    for iv in invites:
        res.append({
            "id": iv.id,
            "home_id": iv.home_id,
            "home_name": iv.home.name,
            "role": iv.role.value,
            "status": iv.status.value
        })
    return res

@router.post('/invitations/respond')
def respond_to_invitation(db: db_dependency, user: user_dependency, req: InvitationRespondRequest):
    user_id = user.get('id')
    x = db.query(UserHome).filter(
        UserHome.id == req.user_home_id,
        UserHome.user_id == user_id,
        UserHome.status == UserHomeStatus.pending
    ).first()
    
    if not x:
        raise HTTPException(status_code=404, detail="Invitation not found.")
        
    if req.action == 'accept':
        x.status = UserHomeStatus.accepted
        db.commit()
        return {"status": "success", "message": "Invitation accepted."}
    elif req.action == 'reject':
        db.delete(x)
        db.commit()
        return {"status": "success", "message": "Invitation rejected."}
    else:
        raise HTTPException(status_code=400, detail="Invalid action.")

@router.get('/{home_id}/members')
def get_home_members(db: db_dependency, user: user_dependency, home_id: int):
    # Verify current user has access to this home
    current_x = db.query(UserHome).filter(
        UserHome.user_id == user.get('id'),
        UserHome.home_id == home_id,
        UserHome.status == UserHomeStatus.accepted
    ).first()
    
    if not current_x:
        raise HTTPException(status_code=403, detail="You do not have access to this home.")
        
    # Get all associations
    members = db.query(UserHome).filter(
        UserHome.home_id == home_id,
        UserHome.status.in_([UserHomeStatus.accepted, UserHomeStatus.pending])
    ).all()
    
    res = []
    for m in members:
        res.append({
            "id": m.user.id,
            "user_home_id": m.id,
            "name": m.user.username,
            "username": m.user.username,
            "email": m.user.email,
            "role": m.role.value,
            "status": "Active" if m.status == UserHomeStatus.accepted else "Pending"
        })
    return res

@router.delete('/{home_id}/members/{user_id}')
def delete_home_member(db: db_dependency, user: user_dependency, home_id: int, user_id: int):
    # 1. Get current user's role in this home
    current_x = db.query(UserHome).filter(
        UserHome.user_id == user.get('id'),
        UserHome.home_id == home_id,
        UserHome.status == UserHomeStatus.accepted
    ).first()
    
    if not current_x:
        raise HTTPException(status_code=403, detail="You do not have access to this home.")
        
    # 2. Get target member
    target_x = db.query(UserHome).filter(
        UserHome.user_id == user_id,
        UserHome.home_id == home_id
    ).first()
    
    if not target_x:
        raise HTTPException(status_code=404, detail="Member not found.")
        
    # 3. Apply authorization rules
    if current_x.role == UserHomeRole.member:
        raise HTTPException(status_code=403, detail="Members cannot delete other users.")
        
    if current_x.role == UserHomeRole.manager:
        if target_x.role in [UserHomeRole.owner, UserHomeRole.manager]:
            raise HTTPException(status_code=403, detail="Managers cannot delete Owners or other Managers.")
            
    # Owner cannot delete themselves (they must delete the whole home or transfer ownership)
    if current_x.user_id == user_id:
         raise HTTPException(status_code=400, detail="Owner cannot remove themselves from their own home.")
         
    db.delete(target_x)
    db.commit()
    return {"status": "success", "message": "Member removed successfully."}
