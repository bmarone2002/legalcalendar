# Caricare il progetto su GitHub

Repository: **https://github.com/bmarone2002/legalcalendar**

## 1. Installa Git (solo la prima volta)

Se non l’hai già fatto, scarica e installa Git per Windows:
- https://git-scm.com/download/win

Dopo l’installazione **chiudi e riapri il terminale** (o Cursor).

---

## 2. Carica il codice con lo script

Apri **PowerShell** o il terminale in Cursor, vai nella cartella del progetto ed esegui:

```powershell
cd "c:\Users\Utente\Desktop\Legal Calendar"
.\push-to-github.ps1
```

Lo script è già configurato con il repo `https://github.com/bmarone2002/legalcalendar.git` e farà:

- inizializzazione del repository (se non esiste);
- collegamento al remote `origin`;
- `git add -A`, commit e push su `main`.

---

## 3. Se il repo su GitHub ha già commit (151 commit)

Il repo remoto esiste già con una sua storia. Puoi:

**Opzione A – Sostituire con questa copia locale (attenzione: perdi la storia remota)**  
Dopo il primo commit locale, esegui:
```powershell
git push -u origin main --force
```

**Opzione B – Unire la storia remota con quella locale**  
Dopo il primo commit locale:
```powershell
git pull origin main --allow-unrelated-histories
# Risolvi eventuali conflitti, poi:
git push -u origin main
```

Se vuoi solo aggiornare un repo che è già una copia di questo progetto, dopo aver installato Git dalla cartella del progetto esegui:

```powershell
git init
git remote add origin https://github.com/bmarone2002/legalcalendar.git
git add -A
git commit -m "Update locale: scroll popup mobile e sync"
git branch -M main
git pull origin main --allow-unrelated-histories
# Se chiede messaggio di merge, salva e chiudi l’editor
git push -u origin main
```

---

## Autenticazione GitHub

Al primo `git push`, GitHub può chiedere accesso:

- **HTTPS:** user e password. La password è un **Personal Access Token** (non la password dell’account).  
  Crea un token: GitHub → Settings → Developer settings → Personal access tokens.
- **GitHub CLI:** se usi `gh auth login`, Git userà le credenziali salvate.
