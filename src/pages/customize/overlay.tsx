import * as React from "react";
import {Fragment} from "react";
import {useBgImageAlpha, useBgImage} from "state";
import {Breadcrumb, FillGap, Label, Page, Slider, TextBlock, TextBox} from "components/building_blocks";
import Previewer from "components/previewer";
import CustomizePage from "pages/customize";

export default function CustomizeOverlayPage() {
    let [url, setUrl] = useBgImage();
    let [opacity, setOpacity] = useBgImageAlpha();

    return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb>Customizer</Breadcrumb>
            <Label>
                overlay url
                <TextBox placeholder="https://example.com/image.png" value={url} onChange={setUrl}/>
            </Label>
            <Label value={opacity}>
                overlay opacity
                <Slider value={opacity} onChange={setOpacity}/>
            </Label>
            <TextBlock medium>
                The overlay url <b>must</b> link to an image or video <b>file</b>.
                A proper link usually ends in .png, .jpg, .mp4, etc.
            </TextBlock>
            <TextBlock>
                <b>Links to YouTube video pages, imgur albums, etc. will NOT work directly.</b>
            </TextBlock>
            <TextBlock>
                <b>If you only want the audio from a video, simply set overlay opacity to 0.00.</b>
            </TextBlock>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>;
};

