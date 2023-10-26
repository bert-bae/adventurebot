dockerweb:
	cd web && docker build ./

dockerserver:
	cd web && docker build ./

build: dockerweb dockerserver