/* 特殊判断,只要结果-+2 都是正确的答案 */

#include <cstdio>
#include <cstring>
#include <cstdlib>

int add(int a,int b){
    return a+b;
}

int main(int argv, char *argc[]){
    FILE *in = fopen(argc[1],"r");
    FILE *out = fopen(argc[3],"r");
    int a,b;
    fscanf(in,"%d %d",&a,&b);
    int result  = add(a,b);
    int u_res;
    fscanf(out,"%d",&u_res);

    int _dec = u_res - result;
    if( _dec < -2 || _dec > 2){
        printf("wrong result!\n");
        return 1;
    }
    
    return 0;
}
