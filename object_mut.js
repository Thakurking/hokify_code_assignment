const obj = {
    a: {
        b: [
            { _id: '5dc0ad700000000000000000', name: 'asdf1' },
            { _id: '5dc0ad700000000000000001', name: 'asdf2' },
            { _id: '5dc0ad700000000000000002', name: 'asdf3' }
        ]
    },
    value: 'hui'
};



function mut_object(obj, params) {
    const input = Object.keys(params)[0];
    const update_value = Object.values(params)[0];
    const args = input.split('.')
    if (args.length > 2) {
        if (Object.keys(obj).includes(args[0])) {
            if (args[1].indexOf('[') > -1 && args[1].indexOf(']') > -1) {
                let id_val = args[1].substring(2, args[1].length - 1)
                let key = args[1].charAt(0);
                const object_value = updateArrayOfObject({object: obj[args[0]][key], val: id_val, update_value, key: args[2]})
                obj[args[0]][key] = object_value;
                return obj;
            }
        }
    } else if (args.length === 2) {
        if (Object.keys(obj).includes(args[0])) {
            let id_val = args[1].substring(2, args[1].length - 1) || null;
            let key = args[1].charAt(0)
            if (args[1].indexOf('[') > -1 && args[1].indexOf(']') > -1) {
                const object_value = updateArrayOfObject({object: obj[args[0]][key], val: id_val, update_value})
                obj[args[0]][key] = object_value;
                return obj;
            }
            addKeys({object: obj[args[0]], key: args[1], update_value})
            return obj;
        }
    } else {
        let key = args[0]
        const object_value = updateArrayOfObject({object: obj, key, update_value})
        return object_value;
    }
}

const result = mut_object(obj, {
    "a.b[5dc0ad700000000000000000]": { "title": "asdf1-updated" }
});
console.log('final result ==>', result)

function updateArrayOfObject(param_obj) {
    /**
     * checking for key only
     */
    if (typeof param_obj.update_value !== 'object') {
        console.log('adding value in key');
        for(let i = 0; i < param_obj.object.length; i++) {
            if (param_obj.object[i]._id === param_obj.val) {
                param_obj.object[i][param_obj.key] = param_obj.update_value;
                return param_obj.object;
            }
        }
    }
    /**
     * checking for adding new entire object
     */
    if (param_obj.val === null && param_obj.update_value !== null) {
        console.log('adding new object')
        param_obj.object.push({ [`${Object.keys(param_obj.update_value)[0]}`]: Object.values(param_obj.update_value)[0],
        [`${Object.keys(param_obj.update_value)[1]}`]: Object.values(param_obj.update_value)[1] })
        return param_obj.object
    }
    /**
     * removing or adding value key from object
     */
    if (param_obj.update_value === null) {
        delete param_obj.object[param_obj.key]
        return param_obj.object
    }
    /**
     * checking for key value both
     */
    for (let i = 0; i < param_obj.object.length; i++) {
        console.log('adding entire object');
        if (param_obj.object[i]._id === param_obj.val) {
            if (param_obj.update_value === null) {
                param_obj.object.splice(i, 1)
                return param_obj.object;
            }
            param_obj.object[i] = { [`${Object.keys(param_obj.object[i])[0]}`]: param_obj.val,
            [`${Object.keys(param_obj.update_value)[0]}`]: Object.values(param_obj.update_value)[0] };
            return param_obj.object;
        }
    }
}

function addKeys(param_obj) {
    param_obj.object[param_obj.key] = param_obj.update_value;
    return param_obj.object;
}
