// --- Header shrink al scroll ---
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if(window.scrollY > 50){ header.classList.add('shrink'); } 
  else { header.classList.remove('shrink'); }
});

// --- Configuración de categorías ---
const subCategories = {
  tarjetaVirtual: ["TODO", "premium", "profesional", "minimalista"],
  sistemasInformaticos: ["TODO", "facturacion", "notarial", "restaurante"],
  office: ["TODO", "macros", "atajos", "programacion"]
};

const dataFiles = {
  tarjetaVirtual: "datos/tarjetaVirtual.json",
  sistemasInformaticos: "datos/sistemasInformaticos.json",
  office: "datos/office.json"
};

let allData = [];
let currentData = {};
let currentParent = "all";
const gallery = document.getElementById("gallery");
const parentBtns = document.querySelectorAll('#parentButtons .filter-btn');
const childDiv = document.getElementById("childButtons");

// --- Modal ---
const modal = document.getElementById('previewModal');
const closeModalBtn = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalFrame = document.getElementById('modalFrame');
const visitSiteBtn = document.getElementById('visitSite');
const viewDetailsBtn = document.getElementById('viewDetails');
const loadingIndicator = document.getElementById('loadingIndicator');

let currentCard = null;

// --- Cargar todos los JSON al inicio ---
async function loadAllData() {
  for (let key in dataFiles) {
    const res = await fetch(dataFiles[key]);
    const json = await res.json();
    currentData[key] = json;
    allData = allData.concat(json);
  }
  renderCards(allData);
}
loadAllData();

// --- Render tarjetas ---
function renderCards(cards) {
  gallery.innerHTML = "";

  if(cards.length === 0){
    // Contenedor centrado
    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "400px";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.position = "relative";
    div.style.textAlign = "center";
    div.style.color = "#2c3e50";
    div.style.fontSize = "1.8rem";
    div.style.fontWeight = "700";

    // Imagen tipo meme como marca de agua
    const memeImg = document.createElement("img");
    memeImg.src = "meme.png";
    memeImg.style.position = "absolute";
    memeImg.style.width = "350px";
    memeImg.style.opacity = "0.15";
    memeImg.style.top = "50%";
    memeImg.style.left = "150%";
    memeImg.style.transform = "translate(-50%, -50%)";
    memeImg.style.pointerEvents = "none";

    // Texto sobre el meme
    const message = document.createElement("span");
    message.textContent = "PRÓXIMAMENTE...";
    message.style.position = "relative";
    message.style.top="55%";
    message.style.left = "140%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.zIndex = "1";

    div.appendChild(memeImg);
    div.appendChild(message);
    gallery.appendChild(div);
    return;
  }

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.setAttribute("data-category", card.category);
    div.innerHTML = `
      <div class="card-thumbnail" style="${card.imageStyle?.container || ''}">
        <img src="${card.thumbnail}" alt="${card.title}" style="${card.imageStyle?.image || ''}">
        <div class="card-overlay"><div class="card-tags">${card.tags.map(tag=>`<span class="tag">${tag}</span>`).join('')}</div></div>
      </div>
      <div class="card-info">
        <h3 class="card-title">${card.title}</h3>
        <p class="card-description">${card.description}</p>
        <div class="card-tags">${card.tags.slice(0,3).map(tag=>`<span class="tag">${tag}</span>`).join('')}</div>
      </div>`;
    div.addEventListener('click',()=>openModal(card));
    gallery.appendChild(div);
  });
}

// --- Modal ---
function openModal(card){
  currentCard = card;
  modalTitle.textContent = card.title;
  loadingIndicator.style.display = 'block';
  modalFrame.style.display = 'none';
  visitSiteBtn.onclick = () => window.open(card.url,'_blank');
  viewDetailsBtn.onclick = () => alert(`Detalles de: ${card.title}\n\n${card.description}`);
  modal.classList.add('active'); 
  document.body.style.overflow='hidden';
  setTimeout(()=>{
    modalFrame.src = card.url;
    modalFrame.onload = ()=>{loadingIndicator.style.display='none'; modalFrame.style.display='block';};
    modalFrame.onerror = ()=>{loadingIndicator.innerHTML='<i class="fas fa-exclamation-triangle"></i><p>Error al cargar la previsualización</p>'; modalFrame.style.display='none';};
  },300);
}
function closeModal(){ 
  modal.classList.remove('active'); 
  setTimeout(()=>{ modalFrame.src=''; document.body.style.overflow='auto'; },300);
}
closeModalBtn.addEventListener('click',closeModal);
window.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// --- Filtros ---
parentBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    parentBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const parent = btn.dataset.parent;
    currentParent = parent;
    renderChildButtons(parent);
  });
});

function renderChildButtons(parent){
  childDiv.innerHTML='';
  if(parent==='all'){
    renderCards(allData);
    return;
  }
  subCategories[parent].forEach(sub=>{
    const b = document.createElement('button');
    b.className='filter-btn';
    b.textContent=sub.charAt(0).toUpperCase()+sub.slice(1);
    b.dataset.child=sub;
    if(sub==='TODO') b.classList.add('active');
    b.addEventListener('click',()=>{
      childDiv.querySelectorAll('.filter-btn').forEach(b2=>b2.classList.remove('active'));
      b.classList.add('active');
      filterCards(parent,sub);
    });
    childDiv.appendChild(b);
  });
  filterCards(parent,'TODO');
}

function filterCards(parent, child){
  let data = currentData[parent] || [];
  if(child !== 'TODO') {
    data = data.filter(item => item.filterCategory === child);
  }
  renderCards(data);
}