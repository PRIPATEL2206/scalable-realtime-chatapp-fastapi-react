class A:
    def __delattr__(self, name: str) -> None:

        print("delete A")
a=A()
del a

# docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
# docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -e REDIS_ARGS="--requirepass mypassword" redis/redis-stack:latest
