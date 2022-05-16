// 将promise封装到class中
class Promise {
    // 构造方法
    constructor(executor) {
        // 添加属性
        this.PromiseState = 'pending';
        this.PromiseResult = null;
        // 声明一个属性保存then中的回调函数，等给与状态后执行
        this.callback = [];
        // resolve函数
        let resolve = (data) => {
            // 实现promise状态只能更改一次
            if (this.PromiseState !== 'pending') return;

            // 1修改对象状态（promisestate）
            this.PromiseState = 'fulfilled';
            // 2设置对象结果值（promiseResult）
            this.PromiseResult = data;
            // 调用成功的回调函数
            // 判断pending状态，因为then为同步函数，所以当new promise中是异步任务
            // 如定时器,代码会一直执行下去不会等定时器,这个时候then就接受不到转态了
            // 因为定时器结束后才会给状态
            // 这个时候就需要保存then中的回调函数，等给与状态后执行

            // 使用遍历执行所有的then回调
            // 通过定时器改为异步
            setTimeout(() => {
                this.callback.forEach(item => {
                    item.onResolved(data);
                })
            })

        }
        // reject函数
        let reject = (data) => {
            // 实现promise状态只能更改一次
            if (this.PromiseState !== 'pending') return;

            this.PromiseState = 'rejected';
            this.PromiseResult = data;

            // 使用遍历执行所有的then回调
            // 通过定时器改为异步
            setTimeout(() => {
                this.callback.forEach(item => {
                    item.onRejected(data);
                })
            })

        }
        // 执行器函数是同步调用的也就是(resolve,reject)=>{resolve('ok')}是同步调用的
        // 同步执行函数executor()
        // 通过try catch来处理抛出的错误
        // 而throw "error"抛出异常中值"error"会被catch(error)中的error接收
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    // then方法封装
    then(onResolved, onRejected) {
        // then允许不填写第二个参数
        // 判断then有没有第二个参数
        // 判断第二个参数是否是函数
        // 完成异常穿透
        if (typeof onRejected !== 'function') {
            // 没有参数就直接抛出个错误
            onRejected = reason => {
                throw reason
            }
        }
        // 当then两个参数都没有时也给与默认值
        if (typeof onResolved !== 'function') {
            onResolved = value => value
        }

        // 实现回复then方法的返回状态是一个promise对象
        // 通过resolve等可以改变then的返回状态
        return new Promise((resolve, reject) => {
            // 获取回调函数的执行结果
            if (this.PromiseState === 'fulfilled') {
                // then中的回调是异步回调，会等同步代码执行完毕后再执行
                // 通过包裹定时器来更改同步任务为异步任务
                setTimeout(() => {
                    try {
                        // 获取回调函数的执行结果
                        let result = onResolved(this.PromiseResult);

                        if (resolve instanceof Promise) {
                            result.then(v => {
                                resolve(v)
                            }, r => {
                                reject(r)
                            })
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        // 抛出异常时把then的状态更改为reject
                        reject(error)
                    }
                })
            }


            if (this.PromiseState === 'rejected') {
                setTimeout(() => {
                    try {
                        let result = onRejected(this.PromiseResult)
                        if (resolve instanceof Promise) {
                            result.then(v => {
                                resolve(v)
                            }, r => {
                                reject(r)
                            })
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            // 判断pending状态，因为then为同步函数，所以当new promise中是异步任务
            // 如定时器,代码会一直执行下去不会等定时器,这个时候then就接受不到转态了
            // 因为定时器结束后才会给状态
            // 这个时候就需要保存then中的回调函数，等给与状态后执行
            if (this.PromiseState === 'pending') {
                // 保存回调函数
                // 当时对象的保存方式会导致多个then进行调用时，后一个then覆盖前一个then
                // 所以要选择数组来保存
                // 每次push进去，再通过遍历来把所有的then都进行执行
                this.callback.push = ({

                    onResolved: () => {
                        try {


                            let result = onResolved(this.PromiseResult)
                            if (result instanceof Promise) {
                                result.then(v => {
                                    resolve(v)
                                }, r => {
                                    reject(r)
                                })
                            } else {
                                resolve(result);
                            }
                        } catch (error) {

                        }
                    },
                    onRejected: () => {
                        // 记住处理try catch
                        try {


                            let result = onRejected(this.PromiseReject)
                            if (result instanceof Promise) {
                                result.then(v => {
                                    resolve(v)
                                }, r => {
                                    reject(r)
                                })
                            } else {
                                resolve(result);
                            }
                        } catch (error) {
                            reject(error)
                        }
                    },
                })
            }

        })
    }

    // catch方法封装
    catch(onRejected) {
        return this.then(undefined, onRejected);

    }

    // 添加resolve方法
    // 不属于实例对象所以要使用static
    static resolve(value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(v => {
                    resolve(v)
                }, r => {
                    reject(r)
                })
            } else {
                resolve(value);
            }
        })
    }

    // 添加reject方法
    static reject(value) {
        return new Promise((resolve, reject) => {
            reject(value)
        })
    }

    // 添加all方法 all方法会传入一个数组，只有数组中都为成功状态才为成功状态
    // all成功的结果是数组中返回数据的一个数组
    static all(promises) {
        return new Promise((resolve, reject) => {
            let count = 0;
            let arr = [];
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    // 得知对象的状态是成功
                    // 每个promise对象都成功
                    count++;
                    // 将当前promise对象成功的结果存入到数组中
                    arr[i] = v;
                    if (count === promises.length) {
                        resolve(arr);
                    }
                }, r => {
                    reject(r)
                })
            }
        })
    }

    // 添加race方法，race方法会传入一个数组，promise状态由数组中第一个改变状态的成员决定
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    // 相比all不需要了解数组中所有成员的状态
                    // 修改返回对象的状态为成功
                    resolve(v);
                }, r => {
                    reject(r)
                })
            }
        })
    }
}



//#region 
// 声明构造函数
// function Promise(executor) {
//     // 添加属性
//     this.PromiseState = 'pending';
//     this.PromiseResult = null;
//     // 声明一个属性保存then中的回调函数，等给与状态后执行
//     this.callback = [];
//     // resolve函数
//     let resolve = (data) => {
//         // 实现promise状态只能更改一次
//         if (this.PromiseState !== 'pending') return;

//         // 1修改对象状态（promisestate）
//         this.PromiseState = 'fulfilled';
//         // 2设置对象结果值（promiseResult）
//         this.PromiseResult = data;
//         // 调用成功的回调函数
//         // 判断pending状态，因为then为同步函数，所以当new promise中是异步任务
//         // 如定时器,代码会一直执行下去不会等定时器,这个时候then就接受不到转态了
//         // 因为定时器结束后才会给状态
//         // 这个时候就需要保存then中的回调函数，等给与状态后执行

//         // 使用遍历执行所有的then回调
//         // 通过定时器改为异步
//         setTimeout(() => {
//             this.callback.forEach(item => {
//                 item.onResolved(data);
//             })
//         })

//     }
//     // reject函数
//     let reject = (data) => {
//         // 实现promise状态只能更改一次
//         if (this.PromiseState !== 'pending') return;

//         this.PromiseState = 'rejected';
//         this.PromiseResult = data;

//         // 使用遍历执行所有的then回调
//         // 通过定时器改为异步
//         setTimeout(() => {
//             this.callback.forEach(item => {
//                 item.onRejected(data);
//             })
//         })

//     }
//     // 执行器函数是同步调用的也就是(resolve,reject)=>{resolve('ok')}是同步调用的
//     // 同步执行函数executor()
//     // 通过try catch来处理抛出的错误
//     // 而throw "error"抛出异常中值"error"会被catch(error)中的error接收
//     try {
//         executor(resolve, reject);
//     } catch (error) {
//         reject(error);
//     }

// }

// 添加then方法
// Promise.prototype.then = function (onResolved, onRejected) {
//     // then允许不填写第二个参数
//     // 判断then有没有第二个参数
//     // 判断第二个参数是否是函数
//     // 完成异常穿透
//     if (typeof onRejected !== 'function') {
//         // 没有参数就直接抛出个错误
//         onRejected = reason => {
//             throw reason
//         }
//     }
//     // 当then两个参数都没有时也给与默认值
//     if (typeof onResolved !== 'function') {
//         onResolved = value => value
//     }

//     // 实现回复then方法的返回状态是一个promise对象
//     // 通过resolve等可以改变then的返回状态
//     return new Promise((resolve, reject) => {
//         // 获取回调函数的执行结果
//         if (this.PromiseState === 'fulfilled') {
//             // then中的回调是异步回调，会等同步代码执行完毕后再执行
//             // 通过包裹定时器来更改同步任务为异步任务
//             setTimeout(() => {
//                 try {
//                     // 获取回调函数的执行结果
//                     let result = onResolved(this.PromiseResult);

//                     if (resolve instanceof Promise) {
//                         result.then(v => {
//                             resolve(v)
//                         }, r => {
//                             reject(r)
//                         })
//                     } else {
//                         resolve(result);
//                     }
//                 } catch (error) {
//                     // 抛出异常时把then的状态更改为reject
//                     reject(error)
//                 }
//             })
//         }


//         if (this.PromiseState === 'rejected') {
//             setTimeout(() => {
//                 try {
//                     let result = onRejected(this.PromiseResult)
//                     if (resolve instanceof Promise) {
//                         result.then(v => {
//                             resolve(v)
//                         }, r => {
//                             reject(r)
//                         })
//                     } else {
//                         resolve(result);
//                     }
//                 } catch (error) {
//                     reject(error)
//                 }
//             })
//         }
//         // 判断pending状态，因为then为同步函数，所以当new promise中是异步任务
//         // 如定时器,代码会一直执行下去不会等定时器,这个时候then就接受不到转态了
//         // 因为定时器结束后才会给状态
//         // 这个时候就需要保存then中的回调函数，等给与状态后执行
//         if (this.PromiseState === 'pending') {
//             // 保存回调函数
//             // 当时对象的保存方式会导致多个then进行调用时，后一个then覆盖前一个then
//             // 所以要选择数组来保存
//             // 每次push进去，再通过遍历来把所有的then都进行执行
//             this.callback.push = ({

//                 onResolved: () => {
//                     try {


//                         let result = onResolved(this.PromiseResult)
//                         if (result instanceof Promise) {
//                             result.then(v => {
//                                 resolve(v)
//                             }, r => {
//                                 reject(r)
//                             })
//                         } else {
//                             resolve(result);
//                         }
//                     } catch (error) {

//                     }
//                 },
//                 onRejected: () => {
//                     // 记住处理try catch
//                     try {


//                         let result = onRejected(this.PromiseReject)
//                         if (result instanceof Promise) {
//                             result.then(v => {
//                                 resolve(v)
//                             }, r => {
//                                 reject(r)
//                             })
//                         } else {
//                             resolve(result);
//                         }
//                     } catch (error) {
//                         reject(error)
//                     }
//                 },
//             })
//         }

//     })
// }

// 添加catch方法
// Promise.prototype.catch = function (onRejected) {
//     return this.then(undefined, onRejected);

// }

// // 添加resolve方法
// Promise.resolve = function (value) {
//     return new Promise((resolve, reject) => {
//         if (value instanceof Promise) {
//             value.then(v => {
//                 resolve(v)
//             }, r => {
//                 reject(r)
//             })
//         } else {
//             resolve(value);
//         }
//     })
// }

// // 添加reject方法
// Promise.reject = function (value) {
//     return new Promise((resolve, reject) => {
//         reject(value)
//     })
// }

// // 添加all方法 all方法会传入一个数组，只有数组中都为成功状态才为成功状态
// // all成功的结果是数组中返回数据的一个数组
// Promise.all = function (promises) {
//     return new Promise((resolve, reject) => {
//         let count = 0;
//         let arr = [];
//         for (let i = 0; i < promises.length; i++) {
//             promises[i].then(v => {
//                 // 得知对象的状态是成功
//                 // 每个promise对象都成功
//                 count++;
//                 // 将当前promise对象成功的结果存入到数组中
//                 arr[i] = v;
//                 if (count === promises.length) {
//                     resolve(arr);
//                 }
//             }, r => {
//                 reject(r)
//             })
//         }
//     })
// }

// // 添加race方法，race方法会传入一个数组，promise状态由数组中第一个改变状态的成员决定
// Promise.race = function (promises) {
//     return new Promise((resolve, reject) => {
//         for (let i = 0; i < promises.length; i++) {
//             promises[i].then(v => {
//                 // 相比all不需要了解数组中所有成员的状态
//                 // 修改返回对象的状态为成功
//                 resolve(v);
//             }, r => {
//                 reject(r)
//             })
//         }
//     })
// }

// then中的回调是异步回调，会等同步代码执行完毕后再执行
// 通过包裹定时器来更改同步任务为异步任务
//#endregion


