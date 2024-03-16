const dropdowns = document.querySelectorAll(".dropdown-container"),//dropdown
  inputLanguageDropdown = document.querySelector("#input-language"),//input language dropdown menu 
  outputLanguageDropdown = document.querySelector("#output-language");//output language dropdown menu

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";//list of languages
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")";//menu items(languages)
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);//append to add elements
  });
}

populateDropdown(inputLanguageDropdown, languages);//calling input languages
populateDropdown(outputLanguageDropdown, languages);//calling output languages

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");//sets toggle as active
  });

  dropdown.querySelectorAll(".option").forEach((item) => {//option works as a thread
    item.addEventListener("click", (e) => {//removes active class from current dropdowns
      //remove active class from current dropdowns
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML; //text translates to selected one
      selected.dataset.value = item.dataset.value; //value specifies here
      translate();
    });
  });
});
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {//specific language is chosen
      dropdown.classList.remove("active");//removes active status
    }
  });
});

const swapBtn = document.querySelector(".swap-position"),  //swap button
  inputLanguage = inputLanguageDropdown.querySelector(".selected"), //for selected input language
  outputLanguage = outputLanguageDropdown.querySelector(".selected"), //for selected output language
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {//used to swap
  const temp = inputLanguage.innerHTML; //stored in a temporary variable
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;//swapped

  const tempValue = inputLanguage.dataset.value;//stored in another temporary value variable 
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;//swapped

  //swap text
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate();
});

function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage =
    inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText
  //https://translate.googleapis.com/translate_a/single (base URL) , client=gtx (indicating general translation request) , sl for input
  )}`;
  fetch(url)
    .then((response) => response.json())//fetches response
    .then((json) => {
      console.log(json);//prints output
      outputTextElem.value = json[0].map((item) => item[0]).join("");//maps the item where to connect and print
    })
    .catch((error) => {
      console.log(error);//Exception Handling
    });
}
inputTextElem.addEventListener("input", (e) => {
 //limit input to 10000 characters
  if (inputTextElem.value.length > 10000) {
    inputTextElem.value = inputTextElem.value.slice(0, 10000);
  }
  translate();
});

const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

  uploadDocument.addEventListener("change", (e) => {
    const file = e.target.files[0];
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
  
    if (file.type === "text/plain") {
      reader.onload = (e) => {
        inputTextElem.value = e.target.result;
        translate();
      };
      reader.readAsText(file);
    } else if (file.type === "application/msword" ||
               file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      reader.onload = (e) => {
        mammoth.extractRawText({arrayBuffer: e.target.result})
          .then(function(resultText) {
            inputTextElem.value = resultText.value;
            translate();
          })
          .catch(function(err) {
            console.log('Error reading Word file:', err);
          });
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "application/pdf") {
      console.log("Processing PDF file");
      reader.onload = (e) => {
        console.log("FileReader result:", e.target.result);
        const typedarray = new Uint8Array(e.target.result);
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
          // Get the first page
          pdf.getPage(1).then(function(page) {
            page.getTextContent().then(function(textContent) {
              let textItems = textContent.items;
              let finalString = '';
    
              for (let i = 0; i < textItems.length; i++) {
                let item = textItems[i];
                finalString += item.str + ' ';
              }
    
              // Now finalString contains the text content of the first page of the PDF
              console.log("Final string:", finalString);
              inputTextElem.value = finalString;
              translate();
            }).catch(function(error) {
              console.log("Error getting text content:", error);
            });
          }).catch(function(error) {
            console.log("Error getting page:", error);
          });
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid file");
    }
  });
const downloadBtn = document.querySelector("#download-btn"); //variable which leads to download button

downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value; //stores output text contents in a variable
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `translated-to-${outputLanguage}.txt`;
    a.href = url;
    a.click();
  }
});

const darkModeCheckbox = document.getElementById("dark-mode-btn"); //dark mode variable 

darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");  //turns on darkmode 
});

const inputChars = document.querySelector("#input-chars"); // stores items present in inputChars
 
inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length; // length of input Element
});