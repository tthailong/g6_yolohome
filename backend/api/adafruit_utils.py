import httpx
import os
from typing import List, Dict, Any
from datetime import datetime

class AdafruitIOClient:
    def __init__(self, username: str = None, key: str = None):
        # Fallback to environment variables if not provided or set to placeholders
        env_username = os.getenv("ADAFRUIT_IO_USERNAME")
        env_key = os.getenv("ADAFRUIT_IO_KEY")

        self.username = username.strip() if username and username != "YOUR_ADAFRUIT_IO_USERNAME" else (env_username or "")
        self.key = key.strip() if key and key != "YOUR_ADAFRUIT_IO_KEY" else (env_key or "")
        
        self.base_url = f"https://io.adafruit.com/api/v2/{self.username}"
        self.headers = {"X-AIO-Key": self.key}

    async def get_last_data(self, feed_key: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/feeds/{feed_key}/data/last",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def get_feed_data(self, feed_key: str, limit: int = 20) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/feeds/{feed_key}/data",
                headers=self.headers,
                params={"limit": limit}
            )
            response.raise_for_status()
            return response.json()

    async def get_historical_data(self, feed_key: str, start_time: str, end_time: str) -> List[Dict[str, Any]]:
        """
        start_time and end_time should be in ISO 8601 format
        """
        params = {
            "start_time": start_time,
            "end_time": end_time,
            "limit": 1000
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/feeds/{feed_key}/data",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return response.json()
