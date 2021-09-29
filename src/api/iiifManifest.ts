// export type ResourceType = "Collection"
//     | "Manifest"
//     | "Canvas"
//     | "Range"
//     | "AnnotationPage"
//     | "Annotation"
//     | "Content"
//     | "AnnotationCollection"
//     | "Video"

// export type Motivation = "painting" | "supplementing";

export interface MultilingualValue<V> {
    [lang: string]: V
}

export type MultilingualString = MultilingualValue<string>

// export interface Resource {
//     id: string
//     type: ResourceType
// }

export interface HasLabel {
    label: MultilingualString
}

export interface HasItems<T> {
    items: Array<T>
}

// export interface Annotation extends Resource {
//     motivation: "supplementing"
// }

// export interface AnnotationPage extends Resource, HasItems<Annotation> {

// }

// export interface HasAnnotations {
//     annotations: Array<AnnotationPage>
// }

// export interface VideoPartBody extends Resource {
//     type: "Video"
//     motivation: "painting"

//     format: string
//     duration: number
//     width: number
//     height: number
// }

// export interface VideoPartItem extends Resource, HasItems <VideoPa {

// }

// export interface VideoPartContainer extends Resource, HasItems<VideoPartItem> {
//     type: "Canvas"

// }

// export interface Manifest extends Resource, HasItems<VideoPartContainer> {
//     provider: MultilingualString
//     summary: MultilingualString
//     homepage: MultilingualString
// }

export interface IVTT {
    items: Array<IVTTItem>
}
export interface HasID {
    id: string
}

export interface IFootnoteItem extends HasID {

}

export interface IVTTItem extends HasID {
    body: {
        "format": "text/plain"
        "type": "TextualBody"
        value: string
    }
    target: string
}

export interface IVideoPart extends HasLabel {
    type: "AnnotationPage"
    annotations: Array<{
        type: "AnnotationPage"
        label: MultilingualString
    }>
    items: Array<{
        items: Array<{
            body: {
                id: string
            }
            type: "Video"
            duration: number
            width: number
            height: number
        }>
    }>
}

export interface IManifest extends HasItems<IVideoPart> {
    label: MultilingualString
}
