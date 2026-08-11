class WeatherAnalysis:

    def __init__(self, session):
        self.session = session

    def get_weather(self):

        weather = self.session.weather_data

        if weather is None or weather.empty:
            return None

        return weather

    def get_summary(self):

        weather = self.get_weather()

        if weather is None:
            return {
                "available": False
            }

        result = {
            "available": True,
            "samples": len(weather)
        }

        if "AirTemp" in weather.columns:
            result["air_temperature"] = {
                "minimum": float(weather["AirTemp"].min()),
                "maximum": float(weather["AirTemp"].max()),
                "average": float(weather["AirTemp"].mean())
            }

        if "TrackTemp" in weather.columns:
            result["track_temperature"] = {
                "minimum": float(weather["TrackTemp"].min()),
                "maximum": float(weather["TrackTemp"].max()),
                "average": float(weather["TrackTemp"].mean())
            }

        if "Humidity" in weather.columns:
            result["humidity"] = {
                "minimum": float(weather["Humidity"].min()),
                "maximum": float(weather["Humidity"].max()),
                "average": float(weather["Humidity"].mean())
            }

        if "WindSpeed" in weather.columns:
            result["wind_speed"] = {
                "minimum": float(weather["WindSpeed"].min()),
                "maximum": float(weather["WindSpeed"].max()),
                "average": float(weather["WindSpeed"].mean())
            }

        if "Rainfall" in weather.columns:
            result["rainfall"] = {
                "occurred": bool(weather["Rainfall"].any())
            }

        return result