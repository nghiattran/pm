
.PHONY: all

CC = gcc
CFLAGS = -g -I../include -I../src -Wall -Wextra -Wmissing-prototypes -Wno-missing-field-initializers
LFLAGS = -L../build -lgit2 -lz
APPS = test
APPS += for-each-ref
APPS += describe

all: $(APPS)

% : %.c
	$(CC) -o $@ $(CFLAGS) $< $(LFLAGS)