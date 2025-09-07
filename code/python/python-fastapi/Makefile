.PHONY: deps-pip
deps-pip:
	pip3 install -r requirements.txt

.PHONY: format
format:
	autopep8  --in-place --aggressive --aggressive **/*.py

.PHONY: lint
lint:
	pylint **/*.py

.PHONY: dev
dev:
	uvicorn main:app --port 8080 --reload
