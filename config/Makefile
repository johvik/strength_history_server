all: agent-cert.pem

agent-key.pem:
	openssl genrsa -out agent-key.pem 2048

agent-csr.pem: agent.cnf agent-key.pem
	openssl req -new -config agent.cnf -key agent-key.pem -out agent-csr.pem

agent-cert.pem: agent-csr.pem agent-key.pem
	openssl x509 -req \
          -days 365 \
          -in agent-csr.pem \
          -signkey agent-key.pem \
          -out agent-cert.pem

agent-verify: agent-cert.pem
	openssl verify -CAfile agent-cert.pem agent-cert.pem

clean:
	rm -f *.pem

test: agent-verify

.PHONY: all clean test
