package payments_jwt_decode

import rego.v1

default allow = false

verified_claims := claims if {
	[verified, _, claims] := io.jwt.decode_verify(
		input.token,
		{
			"secret": "my-secret-key"
		},
	)

	verified == true
}

create if contains(verified_claims.scope, "write:cashout:payments")
read if {
	create
	contains(verified_claims.scope, "read:cashout:payments")
}

operationOpts["autoApprove"]:= contains(verified_claims.scope, "auto-approve:cashout:payments")

allow if {
	create
 	read
}
