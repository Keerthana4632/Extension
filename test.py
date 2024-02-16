def greet(name):
    """Display a greeting message."""
    if name:
        message = f"Hello, {name}!"
        print(message)
    else:
        print("Hello, World!")


# Two blank lines follow the function definition before any subsequent code
greet("Alice")
