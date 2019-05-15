class Dom {
  getRect (el) {
    if (el instanceof window.SVGElement) {
      let rect = el.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    } else {
      return {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
    }
  }

  hasClass (el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }

  addClass (el, className) {
    if (this.hasClass(el, className)) {
      return
    }

    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }

  removeClass (el, className) {
    if (!this.hasClass(el, className)) {
      return
    }

    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
    el.className = el.className.replace(reg, ' ')
  }

  byid (el) {
    return document.getElementById(el)
  }

  byTagName (el) {
    return document.getElementsByTagName(el)
  }

  byClass (el) {
    return document.getElementsByClassName(el)
  }
}

export default new Dom()
