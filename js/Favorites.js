import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)

    this.loadEntries()
  }

  loadEntries() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  saveEntries() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async addEntry(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)
      if (userExists) {
        throw new Error("Usuário já adicionado!")
      }

      const githubUser = await GithubUser.search(username)

      if (githubUser.login === undefined) {
        throw new Error("Usuário não encontrado!")
      }
      this.entries = [...this.entries, githubUser]
      this.updateTable()
      this.saveEntries()
    } catch (error) {
      alert(error)
    }
  }

  deleteEntry(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.updateTable()
    this.saveEntries()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.updateTable()

    this.addEvent()
  }

  addEvent() {
    const addButton = this.root.querySelector(".search-wrapper button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search-wrapper input")

      this.addEntry(value)
      this.root.querySelector(".search-wrapper input").value = ""
      alert("Usuário favoritado!")
    }
  }

  updateTable() {
    this.removeAllTr()

    this.entries.forEach((user) => {
      const createdRow = this.createRow()

      createdRow.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`

      createdRow.querySelector(
        ".user img"
      ).alt = `Foto do perfil do Github de ${user.name}`
      createdRow.querySelector(
        ".user a"
      ).href = `https://github.com/${user.login}`

      createdRow.querySelector(".user p").textContent = user.name

      createdRow.querySelector(".user span").textContent = `/${user.login}`

      createdRow.querySelector(".repositores").textContent = user.public_repos

      createdRow.querySelector(".followers").textContent = user.followers
      createdRow.querySelector(".button-remove").onclick = () => {
        const deleteChoice = confirm(
          "Tem certeza que deseja remover este registro?"
        )

        if (deleteChoice) {
          this.deleteEntry(user)
        }
      }
      this.tbody.append(createdRow)
    })
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
            <td class="user">
              <img
                src="https://github.com/onildojoao.png"
                alt="Foto do perfil do Github de Onildo João"
              />
              <a href="https://github.com/onildojoao" target="_blank">
                <p>Onildo João</p>
                <span>/onildojoao</span>
              </a>
            </td>
            <td class="repositores">1234</td>
            <td class="followers">5678</td>
            <td><button class="button-remove">Remover</button></td>
          `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
