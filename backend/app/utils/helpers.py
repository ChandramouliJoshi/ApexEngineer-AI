import math


def safe_float(value):
    """
    Convert a value to float safely.
    """

    if value is None:
        return None

    try:

        value = float(value)

        if math.isnan(value):
            return None

        if math.isinf(value):
            return None

        return value

    except (TypeError, ValueError):
        return None


def safe_int(value):
    """
    Convert a value to integer safely.
    """

    if value is None:
        return None

    try:

        value = float(value)

        if math.isnan(value):
            return None

        if math.isinf(value):
            return None

        return int(value)

    except (TypeError, ValueError):
        return None


def clean_string(value):
    """
    Clean a string value.
    """

    if value is None:
        return None

    return str(value).strip()


def round_value(
    value,
    decimals=2
):
    """
    Safely round a numerical value.
    """

    value = safe_float(value)

    if value is None:
        return None

    return round(
        value,
        decimals
    )