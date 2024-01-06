#<random>%<ordinal>%<breed>%<age>%<zip>%<name>
from itertools import count, product,repeat
from string import digits, ascii_uppercase 
from random import choices 

def __main__():
    breeds = [ "Afghan", "Beagle", "Chihuahua", "Dachshund", "English Setter" ]
    zips =  [ "00111", "06256", "10002", "20345", "30456", "45675", "53713", "67854", "78594", "84857", "95667" ]
    names = [ "Allen", "Becky", "Charlie", "Dave", "Eric" ]


    

    #dataGenerator = product(breeds, zips , names[:4])
    dataGenerator = zip(reversed(breeds), repeat("10002"), names)
    printData(dataGenerator)


### DataGenerator should return a tuple of the form (breed, zipcode, name)
def printData(dataGenerator):
    idGenerator = ((''.join(choices(ascii_uppercase + digits, k=6)), i) for i in count())

    thing = ((*i, *data) for i, data in zip(idGenerator, dataGenerator))

    for item in thing:
        random = item[0]
        ordinal = item[1]
        breed = item[2]
        zipCode = item[3]
        name = item[4]
        age = ordinal % 17

        id = f'{random}{ordinal}%{breed.replace(" ", "_")}%{age}%{zipCode}%{name}';

        print("{",
            '"id":', '"' + id + '",', 
            '"breed":', '"' + breed + '",',
            '"age":', str(age) + ",",
            '"zip":', '"' + zipCode + '",',
            '"name":', '"' + name + '",',
            '"img":', '"https://corgiorgy.com/corgiswimflip.gif"',
            "},")



__main__()