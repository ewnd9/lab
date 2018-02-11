build:
	gcc `pkg-config --cflags gtk+-3.0` -o main main.cpp `pkg-config --libs gtk+-3.0`
format:
	clang-format -i *.cpp
start: build
	./main
