// { name : {$in: ['mahi', 'rahi']} }
// { age : { $in : [12 , 13] } }
const query1 = { name: "mahi,rahi", age: "12,13" };
const query = {};
for (const item in query1) {
    query[item] = {
        $in: query1[item].includes(',') ? query1[item].split(',') : query1[item]
    }
}
console.log(query);