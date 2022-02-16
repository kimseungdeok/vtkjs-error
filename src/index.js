// import macro from '@kitware/vtk.js/macro';

// console.log('vtk.js imported: ', macro);

import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

// import controlPanel from './controlPanel.html';
const controlPanel = `
<table>
    <tr>
      <td>Height</td>
      <td colspan="3">
        <input class='height' type="range" min="0.5" max="2.0" step="0.1" value="1.0" />
      </td>
    </tr>
    <tr>
      <td>Radius</td>
      <td colspan="3">
        <input class='radius' type="range" min="0.5" max="2.0" step="0.1" value="1.0" />
      </td>
    </tr>
    <tr>
      <td>Resolution</td>
      <td colspan="3">
        <input class='resolution' type="range" min="4" max="100" step="1" value="6" />
      </td>
    </tr>
    <tr>
      <td>Capping</td>
      <td colspan="3">
        <input class='capping' type="checkbox" checked />
      </td>
    </tr>
  <tr style="text-align: center;">
      <td></td>
      <td>X</td>
      <td>Y</td>
      <td>Z</td>
    </tr>
    <tr>
      <td>Origin</td>
      <td>
        <input style="width: 50px" class='center' data-index="0" type="range" min="-1" max="1" step="0.1" value="0" />
      </td>
      <td>
        <input style="width: 50px" class='center' data-index="1" type="range" min="-1" max="1" step="0.1" value="0" />
      </td>
      <td>
        <input style="width: 50px" class='center' data-index="2" type="range" min="-1" max="1" step="0.1" value="0" />
      </td>
    </tr>
    <tr>
      <td>Direction</td>
      <td>
        <input style="width: 50px" class='direction' data-index="0" type="range" min="-1" max="1" step="0.1" value="1" />
      </td>
      <td>
        <input style="width: 50px" class='direction' data-index="1" type="range" min="-1" max="1" step="0.1" value="0" />
      </td>
      <td>
        <input style="width: 50px" class='direction' data-index="2" type="range" min="-1" max="1" step="0.1" value="0" />
      </td>
    </tr>
  </table>
`

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

function createConePipeline() {
  const coneSource = vtkConeSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(coneSource.getOutputPort());

  renderer.addActor(actor);
  return { coneSource, mapper, actor };
}

const pipelines = [createConePipeline(), createConePipeline()];

// Create red wireframe baseline
pipelines[0].actor.getProperty().setRepresentation(1);
pipelines[0].actor.getProperty().setColor(1, 0, 0);

renderer.resetCamera();
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

['height', 'radius', 'resolution'].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('input', (e) => {
    const value = Number(e.target.value);
    pipelines[0].coneSource.set({ [propertyName]: value });
    pipelines[1].coneSource.set({ [propertyName]: value });
    renderWindow.render();
  });
});

document.querySelector('.capping').addEventListener('change', (e) => {
  const capping = !!e.target.checked;
  pipelines[0].coneSource.set({ capping });
  pipelines[1].coneSource.set({ capping });
  renderWindow.render();
});

const centerElems = document.querySelectorAll('.center');
const directionElems = document.querySelectorAll('.direction');

function updateTransformedCone() {
  const center = [0, 0, 0];
  const direction = [1, 0, 0];
  for (let i = 0; i < 3; i++) {
    center[Number(centerElems[i].dataset.index)] = Number(centerElems[i].value);
    direction[Number(directionElems[i].dataset.index)] = Number(
      directionElems[i].value
    );
  }
  console.log('updateTransformedCone', center, direction);
  pipelines[1].coneSource.set({ center, direction });
  renderWindow.render();
}

for (let i = 0; i < 3; i++) {
  centerElems[i].addEventListener('input', updateTransformedCone);
  directionElems[i].addEventListener('input', updateTransformedCone);
}

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.pipelines = pipelines;
global.renderer = renderer;
global.renderWindow = renderWindow;
