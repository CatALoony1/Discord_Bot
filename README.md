Danke Gemini für das Schreiben dieser tollen Markdown Datei.
## .env-Datei erstellen

Bevor du den Bot startest, musst du eine `.env`-Datei im Hauptverzeichnis deines Projekts erstellen. Diese Datei enthält wichtige Konfigurationen, die nicht öffentlich einsehbar sein sollten (wie dein Bot-Token).

1.  **Kopiere die `bsp.env`-Datei:** Im Repository findest du eine Datei namens `bsp.env`. Kopiere diese Datei und benenne die Kopie in `.env` um.
2.  **Passe die Werte an:** Öffne die `.env`-Datei mit einem Texteditor und trage die korrekten Werte für deinen Bot ein. In der Regel musst du mindestens das Bot-Token eintragen.


## Level- und Auswahlmenürollen anpassen

Dieser Bot verwendet bestimmte Rollen-IDs, um Funktionen auszuführen. Damit alles richtig funktioniert, musst du diese Rollen in den entsprechenden Dateien anpassen und sicherstellen, dass die Rollen auf deinem Server existieren.

**Folgende Dateien enthalten Rollen-IDs, die du überprüfen und gegebenenfalls ändern musst:**

* `selectMenuRoles`: Hier sind Rollen für Auswahlmenüs konfiguriert.
* `removeXP`: Diese Datei enthält Levelrollen.
* `giveXP`: Diese Datei enthält ebenfalls Levelrollen


## Erforderliche Rollen auf deinem Server

Damit der Bot alle seine Funktionen nutzen kann, stelle bitte sicher, dass die folgenden Rollen auf deinem Discord-Server existieren. Du kannst sie entweder neu erstellen oder bereits existierende Rollen entsprechend umbenennen. Oder betroffene Zeilen Anpassen

* **Geheimniswahrer**
* **Captains**
* **Bumper**
* **Lottogewinner**
* **Landratte**
* **Begrüßungskomitee**
* **Mitglied**
* **Bump-Ping**
* **KI-Jonas**
* **KI-Bärchen**
* **KI-Silverliver**