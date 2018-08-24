// Helpful alias
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// #region Toggle header
let currenState = false
const getScroll = document.body.getBoundingClientRect.bind(document.body)
const nav = $("nav")

function headerCheck() {
  const expectedState = getScroll().top < -10
  if (currenState !== expectedState) {
    currenState = expectedState
    nav.classList.toggle("active", expectedState)
  }
}

window.addEventListener("scroll", headerCheck)
headerCheck()
// #endregion

// #region Filter tags
const categories = $(".category")

if (categories) {
  function reloadTags() {
    const checked = []
    for (const tag of $$(".category input:checked")) {
      checked.push(tag.getAttribute("data-type"))
    }

    if (checked.length === 0) {
      for (const article of $$("article.hidden")) {
        article.classList.remove("hidden")
      }
    } else {
      for (const article of $$("article")) {
        let shouldShow = false
        for (const tag of checked) {
          if (article.classList.contains(`tag-${tag}`)) {
            shouldShow = true
            break
          }
        }
        if (shouldShow) {
          article.classList.remove("hidden")
        } else {
          article.classList.add("hidden")
        }
      }
    }
  }

  categories.addEventListener("change", reloadTags)
  reloadTags()
}
// #endregion
