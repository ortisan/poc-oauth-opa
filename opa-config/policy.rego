package payments

import rego.v1

default allow := false

create if contains(input.client.scope, "write:cashout:payments")
read if {
	create
	contains(input.client.scope, "read:cashout:payments")
}

operationOpts["autoApprove"]:= contains(input.client.scope, "auto-approve:cashout:payments")

allow if {
	create
  read
}
