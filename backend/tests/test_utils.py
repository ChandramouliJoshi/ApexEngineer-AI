from app.utils.validators import (
    validate_driver,
    validate_year,
    validate_session_type,
    validate_grand_prix
)

from app.utils.calculations import (
    calculate_percentage,
    calculate_delta,
    calculate_percentage_difference,
    clamp,
    calculate_average
)

from app.utils.helpers import (
    safe_float,
    safe_int,
    clean_string,
    round_value
)


def test_validators():

    assert validate_driver("ver") == "VER"
    assert validate_year(2025) == 2025
    assert validate_session_type("r") == "R"
    assert validate_grand_prix(" Monaco ") == "Monaco"


def test_calculations():

    assert calculate_percentage(25, 100) == 25.0
    assert calculate_delta(100, 80) == 20.0
    assert calculate_percentage_difference(110, 100) == 10.0
    assert clamp(120) == 100
    assert calculate_average([10, 20, 30]) == 20.0


def test_helpers():

    assert safe_float("12.5") == 12.5
    assert safe_int("12.5") == 12
    assert clean_string("  VER  ") == "VER"
    assert round_value(12.34567) == 12.35