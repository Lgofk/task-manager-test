const Queue = require('./utils/Queue');
const sleep = require('./utils/sleep');
const shortid = require('shortid');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

let queue = new Queue();

for (let i = 0; i < 10; i++) {
  let task = { id: shortid.generate(), isGonnaFail: Math.round(Math.random()) === 1 };
  queue.enqueue(task);
}

const createWorker = (task) => {
  return new Promise((resolve, reject) => {
    let w = new Worker(__filename, { workerData: task })
    w.on('message', resolve);
    w.on('error', reject);
    w.on('exit', (code) => {
      if (code !== 0)
        new Error(`Worker stopped with exit code ${code}`);
    });
  })
}


const taskHandler = () => {
  if (!queue.isEmpty()) {
    let task = queue.peek();
    console.log(task);
    createWorker(task)
      .then(response => {
        console.log('success', response);
        queue.dequeue();
        taskHandler();
      })
      .catch(err => {
        console.log('fail', err);
        queue.dequeue();
        task.isGonnaFail = false;
        queue.enqueue(task);
        taskHandler();
      });
  }
}

if (isMainThread) {
  taskHandler();
} else {
  if (workerData.isGonnaFail) {
    sleep(2);
    throw new Error(`Task with id: ${workerData.id} failed`);
  } else {
    sleep(2);
    parentPort.postMessage(workerData);
  }
}
