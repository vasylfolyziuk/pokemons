export const debounce = (func: Function, wait = 300) => {
  let timeout: NodeJS.Timeout // for the setTimeout function and so it can be cleared
  function executedFunction(...args: any[]) {
    // the function returned from debounce
    const later = () => {
      // this is the delayed function
      clearTimeout(timeout) // clears the timeout when the function is called
      func(...args) // calls the function
    }
    clearTimeout(timeout) // this clears the timeout each time the function is run again preventing later from running until we stop calling the function
    timeout = setTimeout(later, wait) // this sets the time out to run after the wait period
  }
  executedFunction.cancel = function () {
    // so can be cancelled
    clearTimeout(timeout) // clears the timeout
  }
  return executedFunction
}

export const parseUrlId = (url: string) => {
  return url
    .split("/")
    .filter((path) => path)
    .pop()
}
