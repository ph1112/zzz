var Mahjongtiles_info = {  
  
    userID:-1,                   //对应用户ID  
    in_Pai:new Array(34),        //手里的牌序列  
    out_Pai:new Array(34),      //外面的牌序列  
    sum_Pai:new Array(34),      //总和的牌序列  
  
};  
  
/*对局信息*/  
  
var Mahjonggame_info={  
  
    player:Array(3),            //四个用户对应的组排  
    hunPai:-1,                  //混牌  
    zhuangjia:0,               //庄家  
    PaiList:new Array(84),    //麻将队列  
  
};  

/*麻将队列初始化*/  
function Init_List(arr){  
    var index=0;  
    for(var i=0;i<34;++i)  
    {  
        arr[index++]=i;  
        arr[index++]=i;  
        arr[index++]=i;  
        arr[index++]=i;  
    }  
}  
  
  
/*麻将队列乱序*/  
function shuffle_List(arr) {  
    var i = arr.length, t, j;  
    while (i) {  
        j = Math.floor(Math.random() * i--);  
        t = arr[i];  
        arr[i] = arr[j];  
        arr[j] = t;  
    }  
}  

/*判断是否可以听*/  
function CanTingPai(arr,TingArr){  
  
    var result=false;  
    
    for(var i = 0; i < 34; ++i)  
    {  
        var ret=false;  
         if(arr[i]<4) {             //如果该牌玩家已经有4张了 是否还可以听此张 有待商榷  
             arr[i]++;  
             ret = CanHuPai(arr);  
             arr[i]--;  
         } 
         
             if(ret)  
             {  
                 result=true;  
                 TingArr.push(i);  
             }  
    }  
   return result;  
}  


/*是否为七对*/  
function CanHuPai__7pair(arr){  
  
    var pairCount=0;  
    /*七对*/  
    for(var k in arr) {  
        var c = arr[k];  
        if (c == 2) {  
            pairCount++;  
        }  
        else if (c == 4) {  
            pairCount += 2;  
        }  
        else if( c != 0)   //当c不满足0,2,4情况即有单张出现，直接返回false  
        {  
            return false;  
        }  
  
    }  
  
    if(pairCount==7)  
    {  
        return true;  
    }  
    else  
    {  
        return false;  
    }  
}  

/*判断是否可以胡，枚举几类胡法*/  
function CanHuPai(arr){  
  
    if(CanHuPai__7pair(arr))  
    {  
        return true;  
    }  
    else if(CanHuPai_norm(arr))  
    {  
        return true;  
    }  
    else  
    {  
        return false;  
    }  
}  


/*针对于arr[i]=2情况的剪枝处理*/  
  
function Cancutpair_2(arr,i){  
  
    if(i>26)    //如果为风牌则直接可以剔除对子  
    {  
        return true;                      //true为可以直接剔除，false为还需回溯  
    }  
  
    else if(i==0||i==9||i==18)         //一万 一饼 一条  
    {  
        if(arr[i+1]>=2&&arr[i+2]>=2) //如果对应的二与三都大等于2  
        {  
            return false;  
        }  
        else  
        {  
            return true;  
        }  
    }  
  
    else if(i==8||i==17||i==26)         //九万 九饼 九条  
    {  
        if(arr[i-1]>=2&&arr[i-2]>=2) //如果对应的七与八都大等于2  
        {  
            return false;  
        }  
        else  
        {  
            return true;  
        }  
    }  
  
    else if(i==1||i==10||i==19)         //二万 二饼 二条  
    {  
        if(arr[i-1]+arr[i+1]+arr[i+2]>=4&&arr[i+1]>=2)  //如果一+三+四大于4且三大于2  
        {  
            return false;  
        }  
        else  
        {  
            return true;  
        }  
    }  
    else if(i==7||i==16||i==25)         //八万 八饼 八条  
    {  
        if(arr[i-1]+arr[i+1]+arr[i-2]>=4&&arr[i-1]>=2)  //如果九+七+六大于4且七大于2  
        {  
            return false;  
        }  
        else  
        {  
            return true;  
        }  
    }  
  
    else if(arr[i-1]+arr[i+1]+arr[i-2]+arr[i+2]>=4)   //如果相邻的两端大于四张牌  
    {  
        return false;  
    }  
    else  
    {  
        return true;  
    }  
  
  
}  
  
/*针对于arr[i]=3情况的剪枝处理，与 Cancutpair_2相反，当相邻牌数小于两张牌，则不可取*/  
function Cancutpair_3(arr,i){  
  
    if(i>26)    //如果为风牌则不可以成为对子  
    {  
        return false;  
    }  
  
    else if(i==0||i==9||i==18)         //一万 一饼 一条  
    {  
        if(arr[i+1]>=1&&arr[i+2]>=1) //如果对应的二与三都大等于1  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
  
    else if(i==8||i==17||i==26)         //九万 九饼 九条  
    {  
        if(arr[i-1]>=1&&arr[i-2]>=1) //如果对应的七与八都大等于1  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
  
    else if(i==1||i==10||i==19)         //二万 二饼 二条  
    {  
        if(arr[i-1]+arr[i+1]+arr[i+2]>=2&&arr[i+1]>=1)  //如果一+三+四大于4且三大于2  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
    else if(i==7||i==16||i==25)         //八万 八饼 八条  
    {  
        if(arr[i-1]+arr[i+1]+arr[i-2]>=2&&arr[i-1]>=1)  //如果九+七+六大于4且七大于2  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
  
    else if(arr[i-1]+arr[i+1]+arr[i-2]+arr[i+2]>=2)   //如果相邻的两端大于四张牌  
    {  
        return true;  
    }  
    else  
    {  
        return false;  
    }  
  
  
}  
  
  
  
/*针对于arr[i]=4情况的剪枝处理，与 Cancutpair_3相似，由于多出来两个，故当相邻牌数小于四张牌，则不可取*/  
function Cancutpair_4(arr,i){  
  
    if(i>26)    //如果为风牌则不可以成为对子  
    {  
        return false;  
    }  
  
    else if(i==0||i==9||i==18)         //一万 一饼 一条  
    {  
        if(arr[i+1]>=2&&arr[i+2]>=2) //如果对应的二与三都大等于2  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
  
    else if(i==8||i==17||i==26)         //九万 九饼 九条  
    {  
        if(arr[i-1]>=2&&arr[i-2]>=2) //如果对应的七与八都大等于2  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
  
    else if(i==1||i==10||i==19)         //二万 二饼 二条  
    {  
        if(arr[i-1]+arr[i+1]+arr[i+2]>=4)  //如果一+三+四大等于2  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
    else if(i==7||i==16||i==25)         //八万 八饼 八条  
    {  
        if(arr[i-1]+arr[i+1]+arr[i-2]>=4)  //如果九+七+六大等于2  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    }  
  
    else if(arr[i-1]+arr[i+1]+arr[i-2]+arr[i+2]>=4)   //如果相邻的两端大于四张牌  
    {  
        return true;  
    }  
    else  
    {  
        return false;  
    }  
  
  
}  

function CanHuPai_norm(arr){  
  
    var count =0;  //记录手牌总数  
    for(var i = 0; i < 34; ++i) {  
        count += arr[i];  
    }  
  
    /*剔除对子*/  
    var ret=false;  
    for(var i = 0; i < 34; ++i)  
    {  
        if(arr[i]==2)  
        {  
            if (Cancutpair_2(arr, i))  
            {  
                arr[i] -=2;     //直接剔除  
                ret = CanHuPai_3N_recursive(arr,count-2,0);  
                arr[i] +=2;  
                return ret;  
            }  
            else {  
                arr[i] -=2;  
                ret = CanHuPai_3N_recursive(arr,count-2,0);  
                arr[i] +=2;  
                if(ret)              //如果满足可以返回，不满足还需要尝试其他的对子  
                {  
                    return ret;  
                }  
            }  
        }  
        else if(arr[i]==3)  
        {  
            if (Cancutpair_3(arr, i))  
            {  
                arr[i] -=2;  
                ret = CanHuPai_3N_recursive(arr,count-2,0);  
                arr[i] +=2;  
                if(ret)  
                {  
                    return ret;  
                }  
            }  
        }  
        else if(arr[i]==4)  
        {  
            if (Cancutpair_4(arr, i))  
            {  
                arr[i] -=2;  
                ret = CanHuPai_3N_recursive(arr,count-2,0);  
                arr[i] +=2;  
                if(ret)  
                {  
                    return ret;  
                }  
            }  
        }  
  
    }  
   return ret;  
}  


/*采取DP动态规划的思想 
*递归尝试消一组牌（3张），当arr所有值即count都为0时，即可以胡牌 
*count为剩余牌数 
* 当遇到冲突时，即不可以胡牌 
* */  
function CanHuPai_3N_recursive(arr,count,P) {  
  
  //  process.stdout.write(arr +'\n'+count+'\n'+P+'\n');  
  
    var ret=false;  
    if(count==0)  
    {  
        return true;  
    }  
  
    if(P>26)        // 风牌只能组成碰  
    {  
        if(arr[P]==3)  
        {  
            ret=CanHuPai_3N_recursive(arr,count-3,P+1);  
            return  ret;  
        }  
        else if(arr[P]==0)  
        {  
            ret=CanHuPai_3N_recursive(arr,count,P+1);  
            return  ret;  
        }  
        else  
        {  
            return false;  
        }  
  
    }  
  
        if(arr[P]==0){                                                //如果没有该牌，直接跳过进行下一张  
             ret=CanHuPai_3N_recursive(arr,count,P+1);  
        }  
        if(arr[P]==1){  
            if(P%9>6)                                                  //如果该牌是八或者九，则无法组合顺，不能胡  
            {  
                return false;  
            }  
            else if(arr[P+1]>0&&arr[P+2]>0)                         //能组合成顺  
            {  
                arr[P]--;  
                arr[P+1]--;  
                arr[P+2]--;  
                ret=CanHuPai_3N_recursive(arr,count-3,P+1);  
                arr[P]++;  
                arr[P+1]++;  
                arr[P+2]++;  
            }  
            else                                                    //无法组合顺，不能胡  
            {  
                return false;  
            }  
        }  
        if(arr[P]==2){                                              //与1同理，组成两对顺  
            if(P%9>6)  
            {  
                return false;  
            }  
            else if(arr[P+1]>1&&arr[P+2]>1)  
            {  
                arr[P]-=2;  
                arr[P+1]-=2;  
                arr[P+2]-=2;  
                ret=CanHuPai_3N_recursive(arr,count-6,P+1);  
                arr[P]+=2;  
                arr[P+1]+=2;  
                arr[P+2]+=2;  
            }  
            else  
            {  
                return false;  
            }  
        }  
        if(arr[P]==3){  
  
            ret=CanHuPai_3N_recursive(arr,count-3,P+1);             //当前需求 三对顺等同于三对碰  
            /* 
            if(P%9>6) 
            { 
                ret=CanHuPai_3N_recursive(arr,count-3,P+1); 
            } 
            else if(arr[P+1]>2&&arr[P+2]>2) 
            { 
                arr[P]-=3; 
                arr[P+1]-=3; 
                arr[P+2]-=3; 
                ret=CanHuPai_3N_recursive(arr,count-9,P+1); 
                arr[P]+=3; 
                arr[P+1]+=3; 
                arr[P+2]+=3; 
                if(!ret) 
                { 
                    arr[P + 1] += 3; 
                    arr[P + 2] += 3; 
                    ret=CanHuPai_3N_recursive(arr,count-3,P+1); 
                    arr[P + 1] -= 3; 
                    arr[P + 2] -= 3; 
                } 
            } 
            else 
            { 
                ret=CanHuPai_3N_recursive(arr,count-3,P+1); 
            } 
            */  
        }  
        if(arr[P]==4) {                                       //如果为四张，则至少有一张与后面组成为顺，剩下的递归，P不变  
            if(P%9>6)  
            {  
                return false;  
            }  
            else if (arr[P + 1] > 0 && arr[P + 2] > 0) {  
                arr[P]--;  
                arr[P + 1]--;  
                arr[P + 2]--;  
                ret = CanHuPai_3N_recursive(arr, count - 3, P );  
                arr[P]++;  
                arr[P + 1]++;  
                arr[P + 2]++;  
            }  
            else  
            {  
                return false;  
            }  
        }  
  
    /* 
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'); 
    process.stdout.write(arr +'\n'); 
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'); 
    */  
    return ret;  
}  

function SetTest(arr)  
{   
    arr[0+9]+=3;  
    arr[1+9]+=1;  
    arr[2+9]+=1;  
    arr[3+9]+=1;  
    arr[4+9]+=1;  
    arr[5+9]+=1;  
    arr[6+9]+=1;  
    arr[7+9]+=1;  
    arr[8+9]+=3;  
}  

function SetArrZero(arr){
    for(var i=0; i<arr.length; ++i){
        arr[i] = 0;
    }
}


function GeneralTingpaiInfo(holds, expai){
    var results = {
        'kou_infos':[],
        'ting_infos':{}
    }
    if(holds.length == 1){
        results.ting_infos[holds[0]] = holds[0];
    }else{
        var attr = [];
        for(var i=0; i<34; ++i){
            attr.push(0);
        }
        for(var i=0; i<holds.length; ++i){
            if(holds[i]<=20){
                attr[holds[i]]++;
            }else{
                attr[holds[i]+13]++;
            }
        }
        if(expai>=0){
            attr[expai]--;
        }
        for(var i=0; i<34; ++i){
            if(attr[i] >= 3){
                attr[i]-=3;
                var TingArr = [];
                if( CanTingPai(attr, TingArr)){
                    results.kou_infos.push(i);
                }
                attr[i]+=3;
            }
        }
        for(var i=0; i<34; ++i){
            if(attr[i]>0){
                attr[i] = attr[i] - 1;
                var TingArr = [];
                if( CanTingPai(attr, TingArr) ){
                    results.ting_infos[i] = TingArr;
                }
                attr[i] = attr[i] + 1;
            }
        }
    }
    return results;
}

function GeneralSingleTingpaiInfo(holds, result){
    
    if(holds.length == 1){
        result.push(holds[0]);
        return true;
    }else{
        var attr = [];
        for(var i=0; i<34; ++i){
            attr.push(0);
        }
        for(var i=0; i<holds.length; ++i){
            if(holds[i]<18){
                attr[holds[i]]++;
            }else{
                attr[holds[i]+13]++;
            }
            
        }
        
        return CanTingPai(attr, result);
    }
}


exports.GeneralTingpaiInfo = GeneralTingpaiInfo
exports.CanHuPai = CanHuPai
exports.CanTingPai = CanTingPai
exports.GeneralSingleTingpaiInfo = GeneralSingleTingpaiInfo

function test(){
    var start = new Date();  
    
    var aMahjongtiles_info=Mahjongtiles_info;  
    
    SetArrZero(aMahjongtiles_info.in_Pai);  
    
    SetTest(aMahjongtiles_info.in_Pai);  
    
    //var ret=CanHuPai(Mahjongtiles_info.in_Pai);  
    //process.stdout.write(aMahjongtiles_info.in_Pai +'\n');  
    var Tinglist=new Array();  
    
    var ret = CanTingPai(Mahjongtiles_info.in_Pai, Tinglist);  
    
    process.stdout.write(Tinglist +'\n');  
    
    console.log(ret);  
    
    var end = new Date();  
    //console.log(Tinglist)
    console.log(start,end,end-start);  
}


