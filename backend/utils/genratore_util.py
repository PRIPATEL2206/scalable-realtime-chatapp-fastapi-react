from typing import Iterable
from time import sleep
async def get_genratore(itr:Iterable):
    for i in itr:
        # TODO : remove sleep
        sleep(.005)
        yield i