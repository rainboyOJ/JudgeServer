with open("in") as f:
    a,b = map(int,f.readline().split())
with open("out","w") as fw:
    fw.write(str(a+b))

