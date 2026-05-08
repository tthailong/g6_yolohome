import asyncio
import websockets

async def test():
    try:
        async with websockets.connect('ws://127.0.0.1:8000/ws/1') as ws:
            print('Connected successfully')
            await ws.close()
    except Exception as e:
        print(f'Failed: {e}')

if __name__ == '__main__':
    asyncio.run(test())
