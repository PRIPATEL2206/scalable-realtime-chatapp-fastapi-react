class A:
    def __delattr__(self, name: str) -> None:

        print("delete A")

a=A()
del a