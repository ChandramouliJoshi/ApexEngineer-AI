def validate_driver(driver):
    """
    Validate a driver abbreviation.
    """

    if not isinstance(driver, str):
        raise ValueError("Driver must be a string.")

    driver = driver.strip().upper()

    if len(driver) != 3:
        raise ValueError(
            "Driver must be a 3-letter abbreviation."
        )

    return driver


def validate_year(year):
    """
    Validate F1 season year.
    """

    if not isinstance(year, int):
        raise ValueError("Year must be an integer.")

    if year < 2018:
        raise ValueError(
            "Year must be 2018 or later."
        )

    return year


def validate_session_type(session_type):
    """
    Validate FastF1 session type.
    """

    valid_sessions = {
        "FP1",
        "FP2",
        "FP3",
        "Q",
        "S",
        "SQ",
        "R"
    }

    if not isinstance(session_type, str):
        raise ValueError(
            "Session type must be a string."
        )

    session_type = session_type.strip().upper()

    if session_type not in valid_sessions:
        raise ValueError(
            f"Invalid session type: {session_type}"
        )

    return session_type


def validate_grand_prix(grand_prix):
    """
    Validate Grand Prix name.
    """

    if not isinstance(grand_prix, str):
        raise ValueError(
            "Grand Prix must be a string."
        )

    grand_prix = grand_prix.strip()

    if not grand_prix:
        raise ValueError(
            "Grand Prix cannot be empty."
        )

    return grand_prix