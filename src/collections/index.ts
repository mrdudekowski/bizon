import { withPublishSelected } from "./withPublishSelected";
import { CartSessions as CartSessionsCollection } from "./CartSessions";
import { Media as MediaCollection } from "./Media";
import { Pages as PagesCollection } from "./Pages";
import { PeopleStories as PeopleStoriesCollection } from "./PeopleStories";
import { Products as ProductsCollection } from "./Products";
import { Requests as RequestsCollection } from "./Requests";
import { ShopCategories as ShopCategoriesCollection } from "./ShopCategories";
import { TireIQArticles as TireIQArticlesCollection } from "./TireIQArticles";
import { TireModels as TireModelsCollection } from "./TireModels";
import { TireTypes as TireTypesCollection } from "./TireTypes";
import { TireVariants as TireVariantsCollection } from "./TireVariants";
import { Users as UsersCollection } from "./Users";
import { WheelModels as WheelModelsCollection } from "./WheelModels";
import { WheelTypes as WheelTypesCollection } from "./WheelTypes";
import { WheelVariants as WheelVariantsCollection } from "./WheelVariants";

export const Media = withPublishSelected(MediaCollection);
export const Pages = withPublishSelected(PagesCollection);
export const Products = withPublishSelected(ProductsCollection);
export const TireTypes = withPublishSelected(TireTypesCollection);
export const TireModels = withPublishSelected(TireModelsCollection);
export const TireVariants = withPublishSelected(TireVariantsCollection);
export const WheelTypes = withPublishSelected(WheelTypesCollection);
export const WheelModels = withPublishSelected(WheelModelsCollection);
export const WheelVariants = withPublishSelected(WheelVariantsCollection);
export const ShopCategories = withPublishSelected(ShopCategoriesCollection);
export const TireIQArticles = withPublishSelected(TireIQArticlesCollection);
export const PeopleStories = withPublishSelected(PeopleStoriesCollection);

export const CartSessions = CartSessionsCollection;
export const Requests = RequestsCollection;
export const Users = UsersCollection;

export { withPublishSelected } from "./withPublishSelected";
