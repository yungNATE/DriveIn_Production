<script setup lang="ts">
definePageMeta({
  title: "Nous contacter",
});

const router = useRouter();

const bannedWords = [
  "stage",
  "stages",
  "stagiaire",
  "stagiaires",
  "alternance",
  "alternances",
  "alternant",
  "alternante",
  "alternants",
  "apprentissage",
  "apprenti",
  "apprentie",
  "apprentis",
  "apprenties",
  "apprentice",
  "apprentices",
  "apprenticeship",
  "apprenticeships",
  "intern",
  "internship",
  "internships",
];

const containsBannedWord = (value: string) => {
  const normalizedValue = value.toLowerCase();
  return bannedWords.some((word) => normalizedValue.includes(word));
};

const handleSubmit = (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) {
    return;
  }

  const message = new FormData(target).get("message")?.toString() ?? "";
  if (containsBannedWord(message)) {
    event.preventDefault();
    router.push("/merci");
  }
};
</script>

<template>
  <div class="content container">
    <section class="title">
      <h1>Envoyez-nous un petit mot.</h1>
      <p>On adore lire vos projets, même les plus fous !</p>
      <p class="sub-text">
        Nous ne sommes cependant pas en recherche de stagiaires ou d'alternants
        pour le moment. Bon courage dans vos recherche. 😉
      </p>
    </section>

    <section class="form">
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        @submit="handleSubmit"
        action="/merci"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p style="display: none">
          <label>Ne pas remplir: <input name="bot-field" /></label>
        </p>

        <!-- Nom & Prénom côte à côte -->
        <div class="two-cols">
          <div class="field">
            <input required id="nom" name="nom" type="text" placeholder=" " />
            <label for="nom" class="field__label">Nom</label>
          </div>
          <div class="field">
            <input
              required
              id="prenom"
              name="prenom"
              type="text"
              placeholder=" "
            />
            <label for="prenom" class="field__label">Prénom</label>
          </div>
        </div>

        <!-- Objet de la demande -->
        <div class="field field--select">
          <span class="select-caret" aria-hidden="true"></span>
          <select id="objet" name="objet" required>
            <option value="" disabled selected hidden></option>
            <option>Idée de projet</option>
            <option>Prise d'informations</option>
            <option>Devis / Budget</option>
            <option>Tournage / Captation</option>
            <option>Post-production / Montage</option>
            <option>Motion design / Animation</option>
            <option>Diffusion / Live / Streaming</option>
            <option>Autre</option>
          </select>
          <label for="objet" class="field__label">Objet de la demande</label>
        </div>

        <!-- Email -->
        <div class="field">
          <input
            required
            id="email"
            name="email"
            type="text"
            inputmode="email"
            placeholder=" "
          />
          <label for="email" class="field__label">Email</label>
        </div>

        <!-- Téléphone -->
        <div class="field">
          <input
            required
            id="telephone"
            name="telephone"
            type="tel"
            inputmode="tel"
            placeholder=" "
          />
          <label for="telephone" class="field__label">N° de téléphone</label>
        </div>

        <!-- Message -->
        <div class="field">
          <textarea
            required
            id="message"
            name="message"
            rows="6"
            placeholder=" "
          ></textarea>
          <label for="message" class="field__label">Message</label>
        </div>

        <!-- Submit -->
        <div class="actions">
          <Button type="submit" class="submit">Nous contacter</Button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;

  margin-block: 100px 50px;
}

.form form,
.two-cols {
  gap: 30px;
}

.form form {
  display: flex;
  flex-direction: column;
}

.two-cols {
  display: flex;
  width: 100%;

  .field {
    flex: 1 1 0;
  }
}

.field {
  position: relative;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  color: #fff;
  background: rgba(255, 255, 255, 0.2); /* 20% blanc */
  border: 1px solid rgba(255, 255, 255, 0.5); /* 50% blanc */
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 16px;
  outline: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.field select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-left: 30px;
}

.field textarea {
  resize: vertical;
  min-height: 140px;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.25);
}

/* Faux placeholder accessible - label flottant */
.field__label {
  position: absolute;
  left: 7px;
  bottom: calc(100% - 12px);
  transform: translate(var(--label-x, 8px), 100%);
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  pointer-events: none;
  z-index: 1; /* s'assure que le label est au-dessus du champ */
  transition:
    bottom 0.2s ease,
    transform 0.2s ease,
    font-size 0.2s ease,
    opacity 0.2s ease;
}

/* Remonter le label quand il y a du contenu */
.field:focus-within .field__label,
/* Focus direct (fallback si :focus-within pas supporté) */
.field input:focus + .field__label,
.field textarea:focus + .field__label,
.field select:focus + .field__label,
/* Champs remplis (placeholder invisible) */
.field input:not(:placeholder-shown) + .field__label,
.field textarea:not(:placeholder-shown) + .field__label,
/* Champs requis valides (utile si pas de placeholder) */
.field input:required:valid + .field__label,
.field textarea:required:valid + .field__label,
.field select:required:valid + .field__label,
/* Remplissage navigateur (autofill) */
.field input:-webkit-autofill + .field__label {
  bottom: 100%;
  transform: translate(var(--label-x, 8px), 0);
  font-size: 12px;
}

.actions {
  margin-top: 10px;
}
.submit {
  width: 100%;
}
/* Caret pour le select (positionné à gauche) */
.field--select {
  position: relative;
}

/* Décalage X du label pour le select afin d'éviter le caret */
.field--select {
  --label-x: 36px; /* aligne avec padding-left du select */
}

.field--select .select-caret {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  pointer-events: none;
}

/* petit triangle pointant vers le bas */
.field--select .select-caret::before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(255, 255, 255, 0.85);
}

/* Style des options du select */
.field select option {
  background: #000; /* fond noir */
  color: #fff; /* texte blanc */
}

.field select option:hover {
  background: $primary-color-light; /* hover */
}

/* Au cas où le navigateur n'applique pas :hover, garder la sélection visible */
.field select option:checked,
.field select option:focus,
.field select option:active {
  background: $primary-color-light;
}

.title {
  display: flex;
  flex-direction: column;
  max-width: 700px;
}

.sub-text {
  margin-top: auto;
  color: #ffda00;
}
</style>
