#include <cstdio>
#include <cstdlib>


int main(int argc,char *argv[]){
    printf("%d\n",argc);

    FILE *out = fopen(argv[2], "r");
    FILE *ans= fopen(argv[2], "r");

    int a,b;
    fscanf(out,"%d",&a);
    fscanf(ans,"%d",&b);
    if( a-b < -2 || a-b>2) return 1;
    fclose(out);
    fclose(ans);

    return 0;
}
