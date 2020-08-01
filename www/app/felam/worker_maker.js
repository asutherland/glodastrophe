import Worker from 'worker-loader!./worker_bootstrap';

export default function makeWorker() {
  return new Worker();
}
