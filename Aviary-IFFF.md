# Notes on Aviary's use of IIIF

* Specifying the language of a captions annotation page would be helpful. On FVA
  testimonies, it looks like I can infer the language code from the last
  underscore-separated segment of the filename. For example
  "mssa_hvt_2033_p1of3_pl.vtt" is language code pl (Polish).

* It would be handy to be able to label footnotes with an identifier so they can
  be constant across publications, and across a multipart video.

* The XML annotations are structured differently. The Body of each is an array,
  rather than a string. Is this intentional? Do we need to do anything with XML
  annotations? It looks like these are only for FVA indexes. Is there ever a use
  case where we would need to support them?

