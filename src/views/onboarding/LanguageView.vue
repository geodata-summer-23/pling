<template>
  <h2>Select a language</h2>
  <small style="font-style: bold; color: gray">Choose one</small>
  <br />
  <br />
  <div class="col">
    <div class="row spaced">
      <label for="norsk">Norsk</label>
      <input type="radio" id="norsk" name="language" value="Norsk" />
    </div>
    <hr />
    <div class="row spaced">
      <label for="english">English</label>
      <input type="radio" id="english" name="language" value="English" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
label {
  padding: 1em 1em 1em 0em;
  width: 100%;
}

hr {
  color: gray;
  border-style: inset;
  border-width: 1px;
  margin-left: 0;
  margin-right: 0;
}
</style>
