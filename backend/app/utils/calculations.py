def calculate_percentage(
    value,
    total
):
    """
    Calculate a percentage safely.
    """

    if total == 0:
        return 0.0

    return (
        float(value) /
        float(total)
    ) * 100


def calculate_delta(
    value_1,
    value_2
):
    """
    Calculate the difference between two values.
    """

    return float(value_1) - float(value_2)


def calculate_percentage_difference(
    value_1,
    value_2
):
    """
    Calculate percentage difference relative to value_2.
    """

    if value_2 == 0:
        return 0.0

    return (
        (float(value_1) - float(value_2))
        / abs(float(value_2))
    ) * 100


def clamp(
    value,
    minimum=0,
    maximum=100
):
    """
    Restrict a value to a specified range.
    """

    return min(
        max(float(value), minimum),
        maximum
    )


def calculate_average(values):
    """
    Calculate the average of a collection.
    """

    if not values:
        return 0.0

    return sum(values) / len(values)