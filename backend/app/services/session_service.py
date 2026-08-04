from app.services.fastf1_service import FastF1Service


class SessionService:
    def __init__(self):
        self.fastf1 = FastF1Service()

    def get_session(self, year: int, grand_prix: str, session_type: str = "R"):
        """
        Returns a loaded FastF1 session.
        """
        return self.fastf1.load_session(
            year=year,
            grand_prix=grand_prix,
            session_type=session_type
        )

    def get_session_info(self, year: int, grand_prix: str, session_type: str = "R"):
        """
        Returns session metadata.
        """

        session = self.get_session(
            year,
            grand_prix,
            session_type
        )

        return {
            "event": session.event.EventName,
            "country": session.event.Country,
            "location": session.event.Location,
            "round": int(session.event.RoundNumber),
            "drivers": len(session.drivers),
            "laps": len(session.laps)
        }