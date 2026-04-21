import httpx
import os
from typing import List, Dict, Any
from datetime import datetime

class AdafruitIOClient:
    def __init__(self, username: str, key: str):
        self.username = username.strip() if username else ""
        self.key = key.strip() if key else ""
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

    async def get_historical_data(self, feed_key: str, start_time: str, end_time: str) -> List[Dict[str, Any]]:
        """
        start_time and end_time should be in ISO 8601 format
        """
        params = {
            "start_time": start_time,
            "end_time": end_time
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/feeds/{feed_key}/data",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return response.json()
