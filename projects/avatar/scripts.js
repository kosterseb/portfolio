function generate(form) {
  let engine = "?width=512&height=512&seed=100&nologo=true&model=flux-realism";
  let prompt = "a portrait of a person, ";
  prompt += form.elements.gender.value + ", ";
  prompt += form.elements.age.value + "yo" + ", ";
  prompt += form.elements.hair.value + "hair" + ", ";
  prompt += "solid black background";

  if ((form.elements.engine.value == "cartoon")) {
    engine = "?width=512&height=512&seed=100&nologo=true&model=flux-anime";
    prompt = "a portrait of a cartoon character, ";
    prompt += form.elements.gender.value + ", ";
    prompt += form.elements.age.value + "yo" + ", ";
    prompt += form.elements.hair.value + "hair" + ", ";
    prompt += "solid black background";
  }

  if ((form.elements.engine.value == "3d")) {
    engine = "?width=512&height=512&seed=100&nologo=true&model=flux-3d";
    prompt = "a portrait of a 3d-game character, ";
    prompt += form.elements.gender.value + ", ";
    prompt += form.elements.age.value + "yo" + ", ";
    prompt += form.elements.hair.value + "hair" + ", ";
    prompt += "solid black background";
  }

  if ((form.elements.engine.value == "anime")) {
    engine = "?width=512&height=512&seed=100&nologo=true&model=flux-anime";
    prompt = "a portrait of a anime character, ";
    prompt += form.elements.gender.value + ", ";
    prompt += form.elements.age.value + "yo" + ", ";
    prompt += form.elements.hair.value + "hair" + ", ";
    prompt += "solid black background";
  }

  prompt = encodeURI(prompt);

  let parameters = engine;

  let url = "https://image.pollinations.ai/prompt/" + prompt + parameters;

  document.getElementById("avatar-image").src = url;
}

const value = document.querySelector("#alder");
const input = document.querySelector("#age");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});