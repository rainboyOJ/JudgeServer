import sys
user_out =0
raw_out =0
with open(sys.argv[2]) as f:
    user_out = int(f.readline())
with open(sys.argv[3]) as f2:
    raw_out = int(f2.readline())
if user_out == raw_out:
    sys.exit(0)
else:
    sys.exit(1)
