import { 
  MAX_TEXT_LENGTH, 
  DIAGRAM_SHADOW_RADIUS, 
  DIAGRAM_SHADOW_ALPHA
 } from '../utils/constants'

export function truncateLabel(text: string) {
  if (!text) {
    text = ""
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return text.substring(0, MAX_TEXT_LENGTH)+"..."
  }
  return text
}
export function getLabel(field: any) {
  if (field.category === "view") {
    return truncateLabel(field.view)
  } else {
    return truncateLabel(field.name.split(".")[1])
  } 
}

export function addFilter(svg: any) {
  var defs = svg.append("defs");
  var filter = defs.append("filter")
  .attr("id", "drop-shadow")
  .attr("width", "150%")
  .attr("height", "200%");
  // SourceAlpha refers to opacity of graphic that this filter will be applied to
  // convolve that with a Gaussian with standard deviation 3 and store result
  // in blur
  filter.append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", DIAGRAM_SHADOW_ALPHA)
  .attr("result", "blur");
  // translate output of Gaussian blur to the right and downwards with 2px
  // store result in offsetBlur
  filter.append("feOffset")
  .attr("in", "blur")
  .attr("dx", DIAGRAM_SHADOW_RADIUS)
  .attr("dy", DIAGRAM_SHADOW_RADIUS)
  .attr("result", "offsetBlur");
  // overlay original SourceGraphic over translated blurred opacity by using
  // feMerge filter. Order of specifying inputs is important!
  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
  .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
  .attr("in", "SourceGraphic");
}

export function getTranslation(transform: string) {
  if (!transform) {
    return
  }
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function 
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);
  
  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix. 
  var matrix = g.transform.baseVal.consolidate().matrix;
  
  // As per definition values e and f are the ones for the translation.
  return [matrix.e, matrix.f];
}