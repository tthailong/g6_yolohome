from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Chuỗi kết nối tới MySQL thật sự
URL_DATABASE = "mysql+pymysql://root:hailong2005@localhost:3306/g6yolohome"

# Tạo engine để kết nối
engine = create_engine(URL_DATABASE)

# Session để thao tác với DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Lưu ý: Nếu bạn muốn chạy câu lệnh SQL thuần (Raw SQL):
# with engine.connect() as conn:
#     result = conn.execute(text("SELECT * FROM your_table"))
