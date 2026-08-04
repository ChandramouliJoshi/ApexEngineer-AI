import pandas as pd


class BaseAnalysis:
    """
    Base class for all telemetry analysis modules.
    """

    def __init__(self, telemetry: pd.DataFrame):
        self.telemetry = telemetry