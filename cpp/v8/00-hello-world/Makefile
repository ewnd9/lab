install:
	git clone https://chromium.googlesource.com/v8/v8.git --depth=1
	git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git --depth=1
	PATH=$PATH:$PWD/depot_tools gclient
	cd v8 && PATH=$PATH:$PWD/../depot_tools gclient sync

	cd v8 && tools/dev/v8gen.py x64.release
build:
	gcc `pkg-config --cflags gtk+-3.0` -o main main.cpp `pkg-config --libs gtk+-3.0`
format:
	clang-format -i *.cpp
start: build
	./main
