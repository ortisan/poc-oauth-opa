package example

# Default deny
default allow = false

# Allow based on user roles
allow {
  input.user == "admin"
}

# Return allowed actions for a user
actions = {"read", "write"} {
  input.user == "admin"
}
actions = {"read"} {
  input.user == "guest"
}
