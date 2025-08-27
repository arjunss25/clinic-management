import string, random

def generate_random_password(length=10):
    """Generate a secure random password with letters, digits, and symbols."""
    characters = string.ascii_letters + string.digits + "!@#$%^&*()"
    password=''.join(random.choice(characters) for _ in range(length))
    print('---------', password)
    return password
