/* Generated by Opal 1.1.1 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.$$$, $$ = Opal.$$, $gvars = Opal.gvars;
  if ($gvars.$ == null) $gvars.$ = nil;

  Opal.add_stubs(['$require', '$dispatchEvent', '$[]', '$new', '$to_n']);
  
  self.$require("opal-parser");
  return $gvars.$['$[]']("document").$dispatchEvent($$($nesting, 'JS').$new($gvars.$['$[]']("Event").$to_n(), "parser_loaded"));
})(Opal);